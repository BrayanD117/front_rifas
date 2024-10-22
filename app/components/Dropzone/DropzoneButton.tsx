import { useRef } from "react";
import {
  Text,
  Group,
  Button,
  rem,
  useMantineTheme,
  Container,
  Center,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import {
  IconCloudUpload,
  IconX,
  IconDownload,
} from "@tabler/icons-react";

interface DropzoneButtonProps {
  onFilesAdded: (
    files: Array<{ id: string; url: string; file: File; isNew: boolean }>
  ) => void;
  raffleName: string;
}

export function DropzoneButton({
  onFilesAdded,
  raffleName,
}: DropzoneButtonProps) {
  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null);

  const handleDrop = async (files: File[]) => {
    const optimizedFiles: Array<{
      id: string;
      url: string;
      file: File;
      isNew: boolean;
    }> = [];

    for (const file of files) {
      const optimizedFile = await optimizeFile(file);
      const url = URL.createObjectURL(optimizedFile);
      optimizedFiles.push({
        id: url,
        url: url,
        file: optimizedFile,
        isNew: true,
      });
    }

    onFilesAdded(optimizedFiles);
  };

  const optimizeFile = async (file: File): Promise<File> => {
    if (file.type.startsWith("image/")) {
      return optimizeImage(file);
    }
    return file;
  };

  const optimizeImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          const MAX_WIDTH = 600;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = height * (MAX_WIDTH / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = width * (MAX_HEIGHT / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);

          const quality = 1;

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const optimizedFile = new File(
                  [blob],
                  `${file.name.split(".")[0]}.webp`,
                  {
                    type: "image/webp",
                  }
                );
                resolve(optimizedFile);
              }
            },
            "image/webp",
            quality
          );
        };
      };
    });
  };

  return (
    <Container mt={"md"}>
      <div>
        <Dropzone
          openRef={openRef}
          onDrop={handleDrop}
          radius="md"
          accept={[...IMAGE_MIME_TYPE, "video/*"]}
          maxSize={100 * 1024 ** 2}
          pt={25}
        >
          <div style={{ pointerEvents: 'none' }}>
            <Group justify="center">
              <Dropzone.Accept>
                <IconDownload
                  style={{ width: rem(50), height: rem(50) }}
                  color={theme.colors.blue[6]}
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  style={{ width: rem(50), height: rem(50) }}
                  color={theme.colors.red[6]}
                  stroke={1.5}
                />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconCloudUpload
                  style={{ width: rem(50), height: rem(50) }}
                  stroke={1.5}
                />
              </Dropzone.Idle>
            </Group>

            <Text ta="center" fw={700} fz="lg" mt="xl">
              <Dropzone.Accept>¡Suelta los archivos aquí!</Dropzone.Accept>
              <Dropzone.Reject>
                Solo se permiten imágenes y videos
              </Dropzone.Reject>
              <Dropzone.Idle>Subir archivos</Dropzone.Idle>
            </Text>
            <Text ta="center" fz="sm" mt="xs" c="dimmed">
              Arrastra imágenes o videos aquí o haz clic para
              seleccionarlos.
            </Text>
          </div>
        </Dropzone>
        <Center>
          <Button
            size="md"
            radius="xl"
            onClick={() => openRef.current?.()}
            mt="md"
          >
            Seleccionar archivos
          </Button>
        </Center>
      </div>
    </Container>
  );
}
