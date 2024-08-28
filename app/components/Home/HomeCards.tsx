import CustomCard from "../CustomCard/CustomCard";

const HomeCards: React.FC = () => {
  return (
    <>
      <div>HomeCards</div>
      <CustomCard
          imageSrc="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
          imageAlt="Norway"
          title="Norway Fjord Adventures"
          badgeText="On Sale"
          badgeColor="pink"
          description="With Fjord Tours you can explore more of the magical fjord landscapes with tours and activities on and around the fjords of Norway"
          buttonText="Book classic tour now"
        />
    </>
  )
}

export default HomeCards