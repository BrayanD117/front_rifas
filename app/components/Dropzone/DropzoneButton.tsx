import { useRef, useState, useEffect } from 'react';
import { Text, Group, Button, rem, useMantineTheme, Container, ActionIcon } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconCloudUpload, IconX, IconDownload } from '@tabler/icons-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import classes from './DropzoneButton.module.css';

interface DropzoneButtonProps {
  setImageUrl: React.Dispatch<React.SetStateAction<File[]>>;
  raffleName: string;
}

export function DropzoneButton({ setImageUrl, raffleName }: DropzoneButtonProps) {
  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null);
  const [previews, setPreviews] = useState<{ url: string, file: File }[]>([]);

  const handleDrop = async (files: File[]) => {
    const optimizedFiles: { url: string, file: File }[] = [];

    for (const file of files) {
      const optimizedFile = await optimizeFile(file);
      optimizedFiles.push({ url: URL.createObjectURL(optimizedFile), file: optimizedFile });
    }

    setPreviews((prev) => [...prev, ...optimizedFiles]);
    setImageUrl((prev) => [...prev, ...optimizedFiles.map(item => item.file)]);
  };

  const optimizeFile = async (file: File): Promise<File> => {
    if (file.type.startsWith('image/')) {
      return optimizeImage(file);
    }
    return file;
  };

  const handleRemoveFile = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setImageUrl((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedPreviews = Array.from(previews);
    const [removed] = reorderedPreviews.splice(result.source.index, 1);
    reorderedPreviews.splice(result.destination.index, 0, removed);

    setPreviews(reorderedPreviews);
    setImageUrl(reorderedPreviews.map(item => item.file));
  };

  const optimizeImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          const MAX_WIDTH = 800;
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

          canvas.toBlob((blob) => {
            if (blob) {
              const optimizedFile = new File([blob], `${file.name.split('.')[0]}.webp`, {
                type: 'image/webp',
              });
              resolve(optimizedFile);
            }
          }, 'image/webp');
        };
      };
    });
  };

  return (
    <Container mt={"md"}>
      <div className={classes.wrapper}>
        <Dropzone
          openRef={openRef}
          onDrop={handleDrop}
          className={classes.dropzone}
          radius="md"
          accept={[...IMAGE_MIME_TYPE, 'video/*']}
          maxSize={100 * 1024 ** 2}
          pt={25}
        >
          <div style={{ pointerEvents: 'none' }}>
            <Group justify="center">
              <Dropzone.Accept>
                <IconDownload style={{ width: rem(50), height: rem(50) }} color={theme.colors.blue[6]} stroke={1.5} />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX style={{ width: rem(50), height: rem(50) }} color={theme.colors.red[6]} stroke={1.5} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconCloudUpload style={{ width: rem(50), height: rem(50) }} stroke={1.5} />
              </Dropzone.Idle>
            </Group>

            <Text ta="center" fw={700} fz="lg" mt="xl">
              <Dropzone.Accept>¡Suelta los archivos aquí!</Dropzone.Accept>
              <Dropzone.Reject>Solo se permiten imágenes y videos</Dropzone.Reject>
              <Dropzone.Idle>Subir archivos</Dropzone.Idle>
            </Text>
            <Text ta="center" fz="sm" mt="xs" c="dimmed">
              Arrastra imágenes o videos aquí o haz clic para seleccionarlos.
            </Text>
          </div>
        </Dropzone>

        <Button className={classes.control} size="md" radius="xl" onClick={() => openRef.current?.()}>
          Seleccionar archivos
        </Button>
      </div>

      {previews.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="previews" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  maxWidth: '100%',
                  padding: '10px 0',
                }}
              >
                {previews.map((item, index) => (
                  <Draggable key={item.url} draggableId={item.url} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          position: 'relative',
                          width: 170,
                          height: 170,
                          margin: '5px',
                          backgroundColor: snapshot.isDragging ? 'lightgray' : 'white',
                          transition: 'background-color 0.2s ease',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          ...provided.draggableProps.style,
                        }}
                      >
                        <img
                          src={item.url}
                          alt={`Preview ${index}`}
                          style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <ActionIcon
                          color="red"
                          variant="filled"
                          style={{ position: 'absolute', top: '5px', right: '5px', zIndex: 10 }}
                          onClick={() => handleRemoveFile(index)}
                        >
                          <IconX size={16} />
                        </ActionIcon>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </Container>
  );
}
