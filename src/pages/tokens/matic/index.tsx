import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import classes from "@/styles/tokens.module.scss";
import { Button, Center, Flex, Group, Text, ThemeIcon } from "@mantine/core";
import { GetServerSideProps } from "next";
import axios from "axios"
import { useEffect, useState } from "react";
import POLY from "@/assets/poly.svg"
import User from "@/store/user.store";
import { baseUrl } from "@/contants/baseUrl";
import { XUPER_API_KEY } from "@/pages/_app";
import { GoArrowDownRight, GoArrowUpRight } from "react-icons/go";
import { Web3 } from "web3";
import dayjs from "dayjs";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Token() {

    const { user } = User()

    const [transactions, setTransactions] = useState([])
    const [balance, setBalance] = useState("");
    const router = useRouter()
    useEffect(() => {
        if (!user?.wallet_address) {
            router.push("/get-started")
        }
    }, [])

    useEffect(() => {
        const fetchTransactions = async () => {

            try {
                const result = await Promise.all([
                    await axios.get(`${baseUrl}/customer/transactions?wallet=${user?.wallet_address}&chain=poly`, {
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
                const transactions = result[0].data.data
                const balance = result[1].data.data.balance
                console.log(transactions)
                console.log(user?.wallet_address)

                setTransactions(transactions)
                setBalance(balance)

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
                        <Center><Image src={POLY.src} alt={"usdt"} width={60} height={60} /></Center>
                        <Text ta={"center"} fw={600} fz={12} c={"white"} mt={10}>MATIC</Text>
                        <Text ta={"center"} fw={500} fz={12} c={"dimmed"} mt={2}>POLY</Text>
                        <div className={classes.action_card}>
                            <Text ta={"center"} fw={600} fz={14}>{balance} <Text fz={11} component="span" c={"dimmed"} fw={400}>Matic</Text></Text>
                        </div>
                        <Flex align="center" justify="center" gap={10} mt={10}>
                            <Button size="xs" radius={20} w={80} fz={10} style={{ border: "1px solid #FFFFFF0F" }}>
                                Send
                            </Button>
                            <Button size="xs" radius={20} w={80} fz={10} style={{ border: "1px solid #FFFFFF0F" }}>
                                Receive
                            </Button>
                        </Flex>
                    </div>
                </div>
                <div className={classes.list}>
                    {transactions.map((item: any, index) => (
                        <Group key={index} align="center" justify="space-between" px={10} gap={10} mt={15} w={"100%"}>
                            <div>
                                <Flex align={"center"} justify={"flex-start"} gap={10} w={"100%"}>
                                    <ThemeIcon radius={"50%"}>
                                        {Web3.utils.toChecksumAddress(item.from) === user?.wallet_address ? <><GoArrowUpRight color="green" /></> : <><GoArrowDownRight color="red" /></>}
                                    </ThemeIcon>
                                    <div>
                                        <Text fz={10}>{Web3.utils.toChecksumAddress(item.from) === user?.wallet_address ? "Send" : "Receive"}</Text>
                                        <Text fz={10}>{item.value}</Text>
                                    </div>
                                </Flex>
                            </div>
                            <div>
                                <Text c={"dimmed"} ta="right" fz={10}> {dayjs.unix(item.timeStamp).format("MMM DD, YYYY")}</Text>
                                {Web3.utils.toChecksumAddress(item.from) === user?.wallet_address ? <Text c={"#fff"} ta="right" fz={10} >To <Text c={"dimmed"} component="span" fz={10}>{item.to.slice(0, 6)}...</Text></Text> : <Text c={"#fff"} ta="right" fz={10} >From <Text c={"dimmed"} component="span" fz={10}>{item.from.slice(0, 5)}...</Text></Text>}
                            </div>
                        </Group>
                    ))}
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
            axios.post(`https://app.xuperauth.com/api/v1/misc/get_list_pairs`, { pairs: ["BNB/USD", "ETH/USD", "MATIC/USD", "AVAX/USD", "FTM/USD", "BTC/USD", "USDT/USD", "DAI/USD"] })
        ]);

        const pairs = responses[0].data.data;

        return { props: { data: { pairs } } };
    } catch (error) {
        console.log(error);
        return { props: { data: {} } };
    }
};