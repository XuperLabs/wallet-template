import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import classes from "@/styles/tokens.module.scss";
import { Button, Flex, Group, List, Text } from "@mantine/core";
import { GoArrowUpRight, GoArrowDownLeft, GoArrowDownRight } from "react-icons/go";
import ETH from "@/assets/ETH.png"
import CAKE from "@/assets/CAKE.png"
import DIA from "@/assets/DIA.png"
import OP from "@/assets/OP.png"
import USDT from "@/assets/USDT.png"
import POLYGON from "@/assets/POLYGON.png"
import { GetServerSideProps } from "next";
import axios from "axios"
import formatPrice from "@/utils/PriceFormat";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Tokens } from "@/utils/tokens";
import { useSearchParams } from "next/navigation";
import { XUPER_API_KEY } from "./_app";

const inter = Inter({ subsets: ["latin"] });

export default function Token() {

    const router = useRouter()

    const searchParams = useSearchParams()
    const token = searchParams.get('token')


    useEffect(() => {
        if (!token) router.push("/")
    }, [token])

    console.log(token);

    const data = Tokens.find((item) => item.token == token);
    console.log(data);

    return (
        <div className={classes.wrapper}>
            <div className={classes.card}>
                <div className={classes.icon_card}>
                    <Image src={data?.Icon!} alt={data?.token!} width={100} />
                    <Flex align="center" justify="center" gap={10} mt={20}>
                        {/* <Button leftSection={<GoArrowUpRight />} variant="light" w={110}>
                            Send
                        </Button>
                        <Button leftSection={<GoArrowDownRight />} variant="light" w={110}>
                            Receive
                        </Button> */}
                    </Flex>
                </div>

                <div className={classes.list}>

                </div>
            </div>
        </div >
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { req, params, query } = ctx;
    console.log(query.token)

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