import Image from "next/image";
import classes from "@/styles/tokens.module.scss";
import { Button, Center, CopyButton, Group, Text } from "@mantine/core";
import POLY from "@/assets/poly.svg"
import User from "@/store/user.store";
import QRCode from "react-qr-code";

export default function Token() {

    const { user } = User()

    return (
        <div className={classes.wrapper}>
            <div className={classes.card}>
                <div className={classes.icon_card}>
                    <div>
                        <Center><Image src={POLY.src} alt={"usdt"} width={60} height={60} /></Center>
                        <Text ta={"center"} fw={600} fz={12} c={"white"} mt={10}>MATIC</Text>
                        <Text ta={"center"} fw={500} fz={12} c={"dimmed"} mt={2}>POLY</Text>
                        <Text ta={"center"} mt={20} fz={14}>Receive</Text>
                        <Center mt={30}>
                            <QRCode value={user?.wallet_address!} size={110}
                                style={{ maxHeight: "200px", width: "auto", background: "white" }}
                            />
                        </Center>
                        <Text c={"#64F395"} fz={10} mt={20}>{user?.wallet_address}</Text>

                        <Group justify="center" mt={10}>
                            <CopyButton value={user?.wallet_address!}>
                                {({ copied, copy }) => (
                                    <Button size="xs" radius={15} w={120} color={copied ? 'blue' : '#C95D5D'} onClick={copy}>
                                        <Text fz={10} ta='center' c={"#fff"}>{copied ? 'Copied' : 'Copy'}</Text>
                                    </Button>
                                )}
                            </CopyButton>
                        </Group>
                    </div>

                </div>
            </div>
        </div >
    );
}
