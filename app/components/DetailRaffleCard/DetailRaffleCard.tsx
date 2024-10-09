import { Card, Image, Text, Group, Badge, List, Divider } from '@mantine/core';
import classes from './DetailRaffleCard.module.css';
import { useFormattedDate } from '@/app/hooks/useFormattedDate';
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';
import '@mantine/carousel/styles.css';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';
import { Carousel } from '@mantine/carousel';

interface DetailRaffleCardProps {
    imagesUrls: string[];
    slogan: string;
    totalValue: string;
    description: string;
    moreInfo: { prize: string; prizeCommercialValuation: string; lottery: string; gameDate: string, winnerNumbers: string };
    managerName: string;
    managerContact: string;
    managerAddress: string;
    numberDigits: number;
}

export function DetailRaffleCard({ imagesUrls, slogan, totalValue, description, moreInfo, managerName, managerContact, managerAddress, numberDigits }: DetailRaffleCardProps) {
    const { formatLongDate } = useFormattedDate();
    const autoplay = useRef(Autoplay({ delay: 4000 }));

    const infoTitles = {
        prize: 'Premio',
        prizeCommercialValuation: 'Avalúo comercial',
        lottery: 'Lotería',
        gameDate: 'Fecha y hora de juego',
        winnerNumbers: 'Número de ganadores'
    };

    const formatCurrency = useCurrencyFormatter();

    const items = Object.keys(moreInfo).map((key) => (
        <div key={key}>
            <Text size="xs" color="dimmed">
                {infoTitles[key as keyof typeof moreInfo]}:
            </Text>
            <Badge key={key} variant="light" size="lg" className={classes.badge}>
                {
                    key === 'gameDate' ? formatLongDate(moreInfo[key]) :
                    key === 'prizeCommercialValuation' ? formatCurrency(moreInfo[key as keyof typeof moreInfo]) :
                    moreInfo[key as keyof typeof moreInfo]
                }
            </Badge>
        </div>
    ));

    const slides = imagesUrls.map((imageUrl) => (
        <Carousel.Slide key={imageUrl}>
            <Image src={imageUrl} height={300} />
        </Carousel.Slide>
    ));

    return (
        <Card withBorder radius="md" p="md" className={classes.card}>
            <Card.Section>
                <Carousel
                    withIndicators
                    loop
                    classNames={{
                        root: classes.carousel,
                        controls: classes.carouselControls,
                        indicator: classes.carouselIndicator,
                    }}
                    plugins={[autoplay.current]}
                    >
                    {slides}
                </Carousel>
            </Card.Section>

            <Card.Section className={classes.section} mt="md">
                <Group justify="apart">
                    <Text fz={25} fw={500}>
                        {slogan}
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
            <Card.Section className={classes.section}>
                <Text mt="md" c="dimmed" className={classes.label}>
                    Más información
                </Text>
                <Group mt={5}>
                    <List withPadding>
                        <List.Item>Nombre Responsable: { managerName }</List.Item>
                        <List.Item>Contacto Responsable: { managerContact }</List.Item>
                        <List.Item>Dirección Responsable: { managerAddress }</List.Item>
                    </List>
                    
                </Group>
                <Divider my="md" />
                <Group mt={0}>
                    <List withPadding>
                        <List.Item>Número de cifras a jugar: { numberDigits }</List.Item>
                    </List>
                </Group>
            </Card.Section>
        </Card>
    );
}