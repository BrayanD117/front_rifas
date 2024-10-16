import { Text, Box, rem, Divider } from '@mantine/core';
import { IconUserCheck, IconPhone, IconMapPin, IconHash } from '@tabler/icons-react';
import classes from './ContactIcons.module.css';

interface ContactIconProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> {
    description: React.ReactNode;
    index: number;
}

function ContactIcon({ description, index, ...others }: ContactIconProps) {
    const icons = [IconUserCheck, IconPhone, IconMapPin];
    const titles = ['Nombre', 'Contacto', 'Dirección'];

    const Icon = icons[index];
    const title = titles[index];

    return (
        <div className={classes.wrapper} {...others}>
            <Box mr="md">
                <Icon style={{ width: rem(30), height: rem(30) }} />
            </Box>

            <div>
                <Text c="dimmed" size="xs" className={classes.title}>
                    {title}
                </Text>
                <Text className={classes.description}>{description}</Text>
            </div>
        </div>
    );
}

interface ContactIconsListProps {
    data: { description: string }[];
    numCifras: number;
}

export function ContactIconsList({ data, numCifras }: ContactIconsListProps) {
    return (
        <>
            <div className={classes['items-wrapper']}>
                {data.map((item, index) => (
                    <ContactIcon key={index} description={item.description} index={index} />
                ))}
            </div>

            <Divider my="sm" style={{ width: '100%', marginBottom: 0, marginTop: 0 }} />

            <div className={classes.wrapper} style={{ marginTop: 0 }}>
                <Box mr="md">
                    <IconHash style={{ width: rem(30), height: rem(30) }} />
                </Box>

                <div>
                    <Text c="dimmed" size="xs" className={classes.title}>
                        Número de cifras a jugar
                    </Text>
                    <Text className={classes.description}>{numCifras}</Text>
                </div>
            </div>
        </>
    );
}