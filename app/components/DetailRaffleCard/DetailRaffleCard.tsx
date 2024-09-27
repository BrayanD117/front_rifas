import { Card, Image, Text, Group, Badge } from '@mantine/core';
import classes from './DetailRaffleCard.module.css';
import dayjs from "dayjs";
import "dayjs/locale/es";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.locale("es");
dayjs.extend(advancedFormat);

interface DetailRaffleCardProps {
    image: string;
    title: string;
    totalValue: string;
    description: string;
    moreInfo: { prize: string; lottery: string; gameDate: string };
}

export function DetailRaffleCard({ image, title, totalValue, description, moreInfo }: DetailRaffleCardProps) {
    const formatDate = (dateString: string) => {
        return dayjs(dateString).format("dddd, D [de] MMMM [de] YYYY");
    };
    
    const infoTitles = {
        totalValue: 'Precio',
        prize: 'Premio',
        lottery: 'Lotería',
        gameDate: 'Fecha de juego',
    };

    const items = Object.keys(moreInfo).map((key) => (
        <div key={key}>
            <Text size="xs" color="dimmed">
                {infoTitles[key as keyof typeof moreInfo]}:
            </Text>
            <Badge key={key} variant="light" size="lg" className={classes.badge}>
                {key === 'gameDate' ? formatDate(moreInfo[key]) : moreInfo[key as keyof typeof moreInfo]}
            </Badge>
        </div>
    ));

    return (
        <Card withBorder radius="md" p="md" className={classes.card}>
            <Card.Section>
                <Image src={image} alt={title} height={300} />
            </Card.Section>

            <Card.Section className={classes.section} mt="md">
                <Group justify="apart">
                    <Text fz={25} fw={500}>
                        {title}
                    </Text>
                    <Badge size="xl" variant="light">
                        {totalValue}
                    </Badge>
                </Group>
                <Text fz="md" mt="xs">
                    {description}
                </Text>
            </Card.Section>

            <Card.Section className={classes.section}>
                <Text mt="md" c="dimmed" className={classes.label}>
                    Más información
                </Text>
                <Group mt={5}>
                    {items}
                </Group>
            </Card.Section>
        </Card>
    );
}