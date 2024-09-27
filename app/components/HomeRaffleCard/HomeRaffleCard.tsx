"use client"

import { Card, Image, Text, Badge, Button, Grid } from '@mantine/core';
import { PRIMARY_GREEN, PRIMARY_YELLOW } from '@/app/constants/colors';

interface HomeRaffleCardProps {
    imageSrc: string;
    imageAlt: string;
    title: string;
    badgeText: string;
    description: string;
    buttonText: string;
    onButtonClick: () => void;
}

const HomeRaffleCard: React.FC<HomeRaffleCardProps> = ({
    imageSrc, imageAlt, title, badgeText, description, buttonText, onButtonClick
}) => {
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '400px', height: '100%'}}>
            <Card.Section>
                <Image
                    src={imageSrc}
                    height={160}
                    alt={imageAlt}
                />
            </Card.Section>

            <Grid mt={"md"} mb={"xs"} align='center'>
                <Grid.Col span={8} >
                    <Text fw={500}>{title}</Text>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Badge color={PRIMARY_YELLOW}>{badgeText}</Badge>
                </Grid.Col>
            </Grid>

            <Text size="sm" c="dimmed" lineClamp={3}>
                {description}
            </Text>

            <Button color={PRIMARY_GREEN} fullWidth mt="md" radius="md" onClick={onButtonClick}>
                {buttonText}
            </Button>
        </Card>
    );
}

export default HomeRaffleCard;