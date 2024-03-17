import Image from "next/image";
import { Inter } from "next/font/google";
import classes from "@/styles/send.module.scss";
import { Button, Center, Flex, Group, PinInput, Text, TextInput, ThemeIcon } from "@mantine/core";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import POLY from "@/assets/poly.svg"
import User from "@/store/user.store";
import { baseUrl } from "@/contants/baseUrl";
import { XUPER_API_KEY } from "@/pages/_app";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios"
import useNotification from "@/hooks/useNotification";
import { useSearchParams } from "next/navigation";
import { Tokens } from "@/utils/tokens";
import { IconChevronLeft } from "@tabler/icons-react";

const inter = Inter({ subsets: ["latin"] });

export default function Transfer() {

    const { user } = User();


    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const chain = searchParams.get('chain');

    const item = Tokens.find((x: any) => x.token === token);

    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState("");
    const router = useRouter();

    const [transactionTag, setTransactionTag] = useState("");
    const [amount, setAmount] = useState("");
    const [receiverAddress, setReceiverAddress] = useState("");
    const [step, setStep] = useState(0) // 0 for initial, 1 for confirm, 2 for success;
    const [otp, setOtp] = useState("")
    const { handleError, handleSuccess } = useNotification()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!user?.wallet_address) {
            router.push("/get-started")
        }
    }, [])

    useEffect(() => {
        const fetchTransactions = async () => {

            try {
                const result = await Promise.all([
                    await axios.post(`${baseUrl}/customer/get-balance`, {
                        address: user?.wallet_address,
                        token: token?.toLocaleLowerCase(),
                        chain: chain?.toLocaleLowerCase()
                    }, {
                        headers: {
                            "x-superauth-key": `${XUPER_API_KEY}`,
                        },
                    }),
                ])
                const balance = result[0].data.data.balance
                setBalance(balance)

            } catch (error) {
                console.log(error);
            }
        }

        fetchTransactions()
    }, [user])

    const handleCancel = () => {
        setStep(0);
        setAmount("");
        setReceiverAddress("");
    }

    const handleInitiateTransfer = async () => {

        if (!receiverAddress || !amount) return handleError("Please fill all fields", "Recipient address and amount are required");

        try {
            setLoading(true);
            const { data: res } = await axios.post(`${baseUrl}/customer/initiate-transfer`, {
                wallet_address: user?.wallet_address,
                token: token?.toLocaleLowerCase(),
                chain: chain?.toLocaleLowerCase(),
                receiver_address: receiverAddress,
                amount: amount
            }, {
                headers: {
                    "x-superauth-key": `${XUPER_API_KEY}`,
                },
            });

            if (res.data.transaction_tag) {
                setTransactionTag(res.data.transaction_tag);
                return setStep(1);
            };

            handleSuccess("Transaction Completed successfully", "Transaction Completed successfully")
            return setStep(2);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }


    const handleCompleteTransfer = async () => {
        if (!transactionTag) return handleError("Transaction tag not found", "Transaction tag not found");

        try {
            setLoading(true);
            const { data: res } = await axios.post(`${baseUrl}/customer/transfer`, {
                transaction_tag: transactionTag,
                code: Number(otp)
            }, {
                headers: {
                    "x-superauth-key": `${XUPER_API_KEY}`,
                },
            });

            handleSuccess("Transaction Completed successfully", "Transaction Completed successfully")
            setStep(2);
        } catch (error: any) {
            console.log(error)
            handleError("Transaction failed", `${error?.response?.data?.message || "Transaction failed"}`)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={classes.wrapper}>
            <div className={classes.card}>
                <ThemeIcon style={{
                    cursor: "pointer",
                }} radius={"50%"} size={40} onClick={() => router.back()} >
                    <IconChevronLeft size={20} />
                </ThemeIcon>
                <div className={classes.icon_card}>
                    <div>
                        <Center><Image src={item?.Icon.src} alt={"usdt"} width={90} height={90} /></Center>
                        <Text ta={"center"} fw={600} fz={14} c={"white"} mt={20}>{token}</Text>
                        <Text ta={"center"} fw={500} fz={14} c={"dimmed"} mt={10}>{chain}</Text>
                        <div className={classes.action_card}>
                            <Text ta={"center"} fw={600} fz={14}>{balance} <Text fz={11} component="span" c={"dimmed"} fw={400}>{token}</Text></Text>
                        </div>
                    </div>
                </div>
                {step === 0 && <div className={classes.list}>
                    <Text ta="center" fw={700} c="#ffff" fz={18}>Sending <Text component="span" c={"dimmed"}>{token}</Text></Text>
                    <Text c="#64F395" fz={12} ta="center" mt={20} mb={7}>Receiver Address </Text>
                    <TextInput
                        value={receiverAddress}
                        onChange={(e) => setReceiverAddress(e.currentTarget.value)}
                        styles={{
                            input: {
                                backgroundColor: "transparent",
                                color: "#64F395",
                                border: "1px solid #64F395",
                                borderRadius: "10px",
                                padding: "2px 2px",
                                textAlign: "center",
                                minHeight: "20px",
                                height: "30px",
                                fontSize: "10px"
                            }
                        }}
                        placeholder="Enter receiver address" />
                    <Text c="#64F395" fz={12} ta="center" mt={20} mb={7}>Amount {token} </Text>
                    <TextInput
                        value={amount}
                        onChange={(e) => setAmount(e.currentTarget.value)}
                        styles={{
                            input: {
                                backgroundColor: "transparent",
                                color: "#64F395",
                                border: "1px solid #64F395",
                                borderRadius: "10px",
                                padding: "2px 2px",
                                textAlign: "center",
                                minHeight: "20px",
                                height: "30px",
                                fontSize: "10px"
                            }
                        }}
                        placeholder="Enter Amount To Send" />
                </div>}
                {step === 1 && <div className={classes.list}>
                    <Text ta="center" fw={700} c="#ffff" fz={18}>Sending <Text component="span" c={"dimmed"}>{token}</Text></Text>
                    <Text c="#64F395" fz={12} ta="center" mt={20} mb={7}>OTP</Text>
                    <Group justify="center">
                        <PinInput
                            value={otp}
                            onChange={(value) => setOtp(value)}
                            styles={{
                                input: {
                                    backgroundColor: "transparent",
                                    color: "#64F395",
                                    border: "1px solid #64F395",
                                    borderRadius: "10px",
                                    padding: "2px 2px",
                                    textAlign: "center",
                                    minHeight: "20px",
                                    height: "30px",
                                }
                            }}
                            placeholder="-" />
                    </Group>
                </div>}
                {step === 2 && <div className={classes.list}>
                    <Text ta="center" fw={700} c="#ffff" fz={18}>Sent <Text component="span" c={"dimmed"}> {token}</Text></Text>
                    <Text c="#64F395" fz={12} ta="center" mt={20} mb={7}>Receiver Address </Text>
                    <TextInput
                        value={receiverAddress}
                        onChange={(e) => setReceiverAddress(e.currentTarget.value)}
                        disabled
                        styles={{
                            input: {
                                backgroundColor: "transparent",
                                color: "#64F395",
                                border: "1px solid #64F395",
                                borderRadius: "10px",
                                padding: "2px 2px",
                                textAlign: "center",
                                minHeight: "20px",
                                height: "30px",
                                fontSize: "10px"
                            }
                        }}
                        placeholder="Enter receiver address" />
                    <Text c="#64F395" fz={12} ta="center" mt={20} mb={7}>Amount {token} </Text>
                    <TextInput
                        value={amount}
                        disabled
                        onChange={(e) => setAmount(e.currentTarget.value)}
                        styles={{
                            input: {
                                backgroundColor: "transparent",
                                color: "#64F395",
                                border: "1px solid #64F395",
                                borderRadius: "10px",
                                padding: "2px 2px",
                                textAlign: "center",
                                minHeight: "20px",
                                height: "30px",
                                fontSize: "10px"
                            }
                        }}
                        placeholder="Enter Amount To Send" />
                </div>}
                <Text c="#64F395" mt={10} fw={600} fz={12}>Estimated fee :<Text component="span" fw={400} fz={12}> 0.00006 BNB </Text></Text>

                {step !== 2 && <Flex align="center" justify="space-between" gap={10} mt={20}>
                    <Button onClick={handleCancel} size="sm" bg={"#E21616"} radius={20} w={100} fz={10} style={{ border: "1px solid #FFFFFF0F" }}>
                        Reject
                    </Button>
                    <Button onClick={step == 0 ? handleInitiateTransfer : handleCompleteTransfer} loading={loading} loaderProps={{ type: "dots" }} size="sm" bg={"#C95D5D"} radius={20} w={100} fz={10} style={{ border: "1px solid #FFFFFF0F" }}>
                        Approve
                    </Button>
                </Flex>}
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