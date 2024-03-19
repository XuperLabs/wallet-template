import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import classes from "@/styles/tokens.module.scss";
import { Button, Center, Flex, Group, List, Text } from "@mantine/core";
import { GoArrowUpRight, GoArrowDownLeft, GoArrowDownRight } from "react-icons/go";
import POLYGON from "@/assets/POLYGON.png"
import { GetServerSideProps } from "next";
import axios from "axios"
import formatPrice from "@/utils/PriceFormat";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Tokens } from "@/utils/tokens";
import { useSearchParams } from "next/navigation";
import USDT from "@/assets/usdt.svg"
import User from "@/store/user.store";
import { baseUrl } from "@/contants/baseUrl";
import { XUPER_API_KEY } from "@/pages/_app";

const inter = Inter({ subsets: ["latin"] });

export default function Token() {

    const { user } = User()
    console.log(user?.wallet_address)

    useEffect(() => {
        const fetchTransactions = async () => {

            try {
                const result = Promise.all([
                    await axios.get(`${baseUrl}/customer/transactions?wallet=${user?.wallet_address}&chain=bsc`, {
                        headers: {
                            "x-superauth-key": `${XUPER_API_KEY}`,
                        },
                    }),
                    await axios.post(`${baseUrl}/customer/get-balance`, {
                        address: user?.wallet_address,
                        token: "matic",
                        chain: "poly"
                    }, {
                        headers: {
                            "x-superauth-key": `${XUPER_API_KEY}`,
                        },
                    }),

                ])
                console.log(result)

            } catch (error) {

            }
        }

        fetchTransactions()
    }, [user])

    return (
        <div className={classes.wrapper}>
            <div className={classes.card}>
                <div className={classes.icon_card}>
                    <div>
                        <Center><Image src={USDT.src} alt={"usdt"} width={100} height={100} /></Center>
                        <Text ta={"center"} fw={600} c={"white"} mt={20}>Tether</Text>
                        <Text ta={"center"} fw={500} fz={14} c={"dimmed"} mt={10}>USDT</Text>
                        <div className={classes.action_card}>
                            <Text ta={"center"} fw={600}> 0 <Text fz={12} component="span" c={"dimmed"} fw={400}>USDT</Text></Text>
                        </div>
                        <Flex align="center" justify="center" gap={10} mt={20}>
                            <Button radius={20} w={80} fz={10} style={{ border: "1px solid #FFFFFF0F" }}>
                                Send
                            </Button>
                            <Button radius={20} w={80} fz={10} style={{ border: "1px solid #FFFFFF0F" }}>
                                Receive
                            </Button>
                        </Flex>
                    </div>
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