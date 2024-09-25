import { Container, Group, ActionIcon, rem, Divider, Image } from "@mantine/core";
import {
  IconBrandTwitter,
  IconBrandYoutube,
  IconBrandInstagram,
  IconAd2
} from "@tabler/icons-react";
import classes from "./styles/Footer.module.css";

export function Footer() {
  return (
    <div className={classes.footer}>
      <Divider />
      <Container className={classes.inner}>
        <Image
          alt="Rifa Mania"
          h={40}
          w="auto"
          src="/assets/Logo-Rifa-Manía.webp"
          />
        <Group
          gap={0}
          className={classes.links}
          justify="flex-end"
          wrap="nowrap"
        >
          <ActionIcon size="lg" color="gray" variant="subtle" component="a" href="https://twitter.com/ganaganaoficial/" target="_blank">
            <IconBrandTwitter
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle" component="a" href="https://www.youtube.com/channel/UCGPe6UsUNlFxMSb6GSKTx4g" target="_blank">
            <IconBrandYoutube
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle" component="a" href="https://www.instagram.com/ganaganaoficial/" target="_blank">
            <IconBrandInstagram
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </ActionIcon>
        </Group>
      </Container>
    </div>
  );
}
