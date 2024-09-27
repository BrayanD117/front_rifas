import { useRef } from 'react';
import { Text, Group, Button, rem, useMantineTheme, Container } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconCloudUpload, IconX, IconDownload } from '@tabler/icons-react';
import classes from './DropzoneButton.module.css';

export function DropzoneButton() {
  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null);

  return (
    <Container mt={"md"}>
    <div className={classes.wrapper}>
      <Dropzone
        openRef={openRef}
        onDrop={() => {}}
        className={classes.dropzone}
        radius="md"
        accept={IMAGE_MIME_TYPE}
        maxSize={30 * 1024 ** 2}
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
              <IconCloudUpload style={{ width: rem(50), height: rem(50) }} stroke={1.5} />
            </Dropzone.Idle>
          </Group>

          <Text ta="center" fw={700} fz="lg" mt="xl">
            <Dropzone.Accept>¡Suelta los archivos aquí!</Dropzone.Accept>
            <Dropzone.Reject>Solo se permiten imágenes</Dropzone.Reject>
            <Dropzone.Idle>Subir imágenes</Dropzone.Idle>
          </Text>
          <Text ta="center" fz="sm" mt="xs" c="dimmed">
            Arrastra imágenes aquí o haz clic para seleccionarlas. Aceptamos imágenes en los formatos png, jpg, jpeg, webp y menos de 30mb.
          </Text>
        </div>
      </Dropzone>

      <Button className={classes.control} size="md" radius="xl" onClick={() => openRef.current?.()}>
        Seleccionar imágenes
      </Button>
    </div>
    </Container>
  );
}
