import axios from "axios";

export default async () => {
  const res = await axios.get(
    `${process.env.GATSBY_API_URL}/create_guest_cart`
  );
  await localStorage.setItem("unifi", res.data);
};
