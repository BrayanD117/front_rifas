import { Card, Image, Text, Group, Badge } from '@mantine/core';
import classes from './DetailRaffleCard.module.css';
import { useFormattedDate } from '@/app/hooks/useFormattedDate';
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';

interface DetailRaffleCardProps {
    imageUrl: string;
    title: string;
    totalValue: string;
    description: string;
    moreInfo: { prize: string; lottery: string; gameDate: string };
}

export function DetailRaffleCard({ imageUrl, title, totalValue, description, moreInfo }: DetailRaffleCardProps) {
    const { formatLongDate } = useFormattedDate();
    
    const infoTitles = {
        totalValue: 'Precio',
        prize: 'Premio',
        lottery: 'Lotería',
        gameDate: 'Fecha de juego',
    };

    const formatCurrency = useCurrencyFormatter();

    const items = Object.keys(moreInfo).map((key) => (
        <div key={key}>
            <Text size="xs" color="dimmed">
                {infoTitles[key as keyof typeof moreInfo]}:
            </Text>
            <Badge key={key} variant="light" size="lg" className={classes.badge}>
                {key === 'gameDate' ? formatLongDate(moreInfo[key]) : moreInfo[key as keyof typeof moreInfo]}
            </Badge>
        </div>
    ));

    return (
        <Card withBorder radius="md" p="md" className={classes.card}>
            <Card.Section>
                <Image src={`${process.env.NEXT_PUBLIC_UPLOADS_URL}/${imageUrl}`} alt={title} height={300} />
            </Card.Section>

            <Card.Section className={classes.section} mt="md">
                <Group justify="apart">
                    <Text fz={25} fw={500}>
                        {title}
                    </Text>
                    <Badge fz={20} size="xl" variant="light">
                        {formatCurrency(totalValue)}
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