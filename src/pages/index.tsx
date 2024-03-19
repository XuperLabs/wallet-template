import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import classes from "@/styles/Home.module.scss";
import { Button, Flex, Group, List, Text } from "@mantine/core";
import { GoArrowUpRight, GoArrowDownLeft, GoArrowDownRight } from "react-icons/go";
import ETH from "@/assets/ETH.png"
import CAKE from "@/assets/CAKE.png"
import DIA from "@/assets/DIA.png"
import OP from "@/assets/OP.png"
import USDT from "@/assets/USDT.png"
import BSC from "@/assets/BSC.svg"
import POLYGON from "@/assets/POLYGON.png"
import { GetServerSideProps } from "next";
import axios from "axios"
import formatPrice from "@/utils/PriceFormat";
import Link from "next/link";
import { useEffect } from "react";
import User from "@/store/user.store";
import { useRouter } from "next/router";
import { XUPER_API_KEY } from "./_app";

const inter = Inter({ subsets: ["latin"] });

interface PageProps {
  data: Pairs
}

export interface Pairs {
  pairs: {
    pair: string,
    price: number
  }[]
}

export default function Home({ data }: PageProps) {

  const router = useRouter()
  const { user } = User()

  useEffect(() => {
    if (!user?.wallet_address) {
      router.push("/get-started")
    }
  }, [])

  const mockdata = [
    {
      token: "USDT",
      chain: "USDT",
      token_name: "Tether USD",
      price: `${formatPrice("1.01", "USD")}`,
      icon: USDT.src,
    },
    {
      token: "Ethereum",
      chain: "ETH",
      token_name: "ETHEREUM",
      price: `${formatPrice(data.pairs?.find(item => item?.pair == "ETH/USD")?.price!, "USD")}`,
      icon: ETH.src,
    },
    {
      token: "BNB",
      chain: "BSC",
      token_name: "BNB",
      price: `${formatPrice(data.pairs?.find(item => item?.pair == "BNB/USD")?.price!, "USD")}`,
      icon: BSC.src,
    },
    {
      token: "MATIC",
      chain: "POLY",
      token_name: "Polygon",
      price: `${formatPrice(data.pairs?.find(item => item?.pair == "MATIC/USD")?.price!, "USD")}`,
      icon: POLYGON.src,
      link: "/tokens/matic"
    },
    {
      token: "Optimism",
      chain: "MATIC",
      token_name: "",
      price: ` ${formatPrice(data.pairs?.find(item => item?.pair == "AVAX/USD")?.price!, "USD")}`,
      icon: OP.src,
    },
    {
      token: "Pancakeswap",
      chain: "CAKE",
      token_name: "",
      price: `${formatPrice(data.pairs?.find(item => item?.pair == "AVAX/USD")?.price!, "USD")}`,
      icon: CAKE.src,
    },
    {
      token: "Dai",
      chain: "DAI",
      token_name: "",
      price: `${formatPrice(data.pairs?.find(item => item?.pair == "DAI/USD")?.price!, "USD")}`,
      icon: DIA.src,
    }
  ]
  return (
    <div className={classes.wrapper}>
      <div className={classes.card}>
        <div className={classes.balance_card}>
          <Text ta={"center"} fw={600} fz={13}>My balance</Text>
          <Text ta={"center"} fw={700} fz={28}>$ 0.00</Text>
          <Flex align="center" justify="center" gap={10} mt={20}>
            <Button leftSection={<GoArrowUpRight />} variant="light" w={110}>
              Send
            </Button>
            <Button leftSection={<GoArrowDownRight />} variant="light" w={110}>
              Receive
            </Button>
          </Flex>
        </div>

        <div className={classes.list}>
          {mockdata.map((item, index) => (
            <Link key={index} href={`/tokens?chain=${item.chain}&token=${item.token}`}>
              <Group justify="space-between" w={"100%"} mt={15} >
                <Flex align="center" gap={20}>
                  <Image src={item.icon} alt="etherum" width={30} height={30} />
                  <div>
                    <Text fz={14}>{item.token}</Text>
                    <Text fz={14} c={"#5D5D5D"}>{item.chain}</Text>
                  </div>
                </Flex>
                <div>
                  <Text ta="right" fz={13}>{item.price}</Text>
                  <Text c={"#5D5D5D"} fz={13} ta="right">161.53</Text>
                </div>
              </Group>
            </Link>
          ))}
        </div>
      </div>
    </div >
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req, params } = ctx;

  try {
    const responses = await Promise.all([
      axios.post(`https://app.xuperauth.com/api/v1/misc/get_list_pairs`, { pairs: ["BNB/USD", "ETH/USD", "MATIC/USD", "AVAX/USD", "FTM/USD", "BTC/USD", "USDT/USD", "DAI/USD"] }, {
        headers: {
          "x-superauth-key": `${XUPER_API_KEY}`,
        },
      })
    ]);

    const pairs = responses[0].data.data;

    return { props: { data: { pairs } } };
  } catch (error) {
    console.log(error);
    return { props: { data: {} } };
  }
};