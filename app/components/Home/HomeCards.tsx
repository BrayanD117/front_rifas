"use client"

import { Container, Grid } from "@mantine/core";
import CustomCard from "../CustomCard/CustomCard";

const HomeCards: React.FC = () => {
  return (
    <>
      <Container mt={"md"} size={"xl"}>
        <Grid>
          <Grid.Col span={3}>
            <CustomCard
              imageSrc="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
              imageAlt="Norway"
              title="Norway Fjord Adventures"
              badgeText="On Sale"
              badgeColor="pink"
              description="With Fjord Tours you can explore more of the magical fjord landscapes with tours and activities on and around the fjords of Norway"
              buttonText="Book classic tour now"
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <CustomCard
              imageSrc="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
              imageAlt="Norway"
              title="Norway Fjord Adventures"
              badgeText="On Sale"
              badgeColor="pink"
              description="With Fjord Tours you can explore more of the magical fjord landscapes with tours and activities on and around the fjords of Norway"
              buttonText="Book classic tour now"
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <CustomCard
              imageSrc="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
              imageAlt="Norway"
              title="Norway Fjord Adventures"
              badgeText="On Sale"
              badgeColor="pink"
              description="With Fjord Tours you can explore more of the magical fjord landscapes with tours and activities on and around the fjords of Norway"
              buttonText="Book classic tour now"
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <CustomCard
              imageSrc="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
              imageAlt="Norway"
              title="Norway Fjord Adventures"
              badgeText="On Sale"
              badgeColor="pink"
              description="With Fjord Tours you can explore more of the magical fjord landscapes with tours and activities on and around the fjords of Norway"
              buttonText="Book classic tour now"
            />
          </Grid.Col>
        </Grid>
      </Container>
      
    </>
  )
}

export default HomeCards