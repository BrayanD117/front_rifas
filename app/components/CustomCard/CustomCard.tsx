"use client"

import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';

interface CustomCardProps {
    imageSrc: string;
    imageAlt: string;
    title: string;
    badgeText: string;
    badgeColor: string;
    description: string;
    buttonText: string;
  }

const CustomCard: React.FC<CustomCardProps> = ({
    imageSrc, imageAlt, title, badgeText, badgeColor, description, buttonText
}) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={imageSrc}
          height={160}
          alt={imageAlt}
        />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{title}</Text>
        <Badge color={badgeColor}>{badgeText}</Badge>
      </Group>

      <Text size="sm" c="dimmed">
        {description}
      </Text>

      <Button color="blue" fullWidth mt="md" radius="md">
        {buttonText}
      </Button>
    </Card>
  );
}

export default CustomCard;