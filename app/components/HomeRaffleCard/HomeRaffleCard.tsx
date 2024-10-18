"use client"

import { Card, Image, Text, Badge, Button, Grid, Progress, Group } from '@mantine/core';
import { PRIMARY_GREEN, PRIMARY_YELLOW } from '@/app/constants/colors';

interface HomeRaffleCardProps {
    imageSrc: string;
    imageAlt: string;
    slogan: string;
    badgeText: string;
    description: string;
    buttonText: string;
    onButtonClick: () => void;
}

const HomeRaffleCard: React.FC<HomeRaffleCardProps> = ({
    imageSrc, imageAlt, slogan, badgeText, description, buttonText, onButtonClick
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

            <Grid mt={"sm"} mb={"xs"} align='center'>
                <Grid.Col span={8} >
                    <Text fw={500}>{slogan}</Text>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Badge color={PRIMARY_YELLOW}>{badgeText}</Badge>
                </Grid.Col>
            </Grid>

            <Text size="sm" c="dimmed" lineClamp={3} mb={0}>
                {description}
            </Text>

            <Group mt={0} mb={0}>
                <Progress radius="md" size="md" value={70} animated style={{ flexGrow: 1 }} />
                <Text size="sm" fw={700} variant="gradient" gradient={{ from: 'blue', to: 'yellow', deg: 90 }}>70% vendido</Text>
            </Group>

            <Button color={PRIMARY_GREEN} fullWidth mt="md" radius="md" onClick={onButtonClick}>
                {buttonText}
            </Button>
        </Card>
    );
}

export default HomeRaffleCard;