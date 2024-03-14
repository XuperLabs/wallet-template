
import Router, { useRouter } from "next/router";
import axios, { isAxiosError } from "axios";
import Cookies from 'js-cookie';
import {
    Button,
    Text,
    Group,
    LoadingOverlay,
    Alert,
    PinInput
} from "@mantine/core";

// import { loginValidator } from '@/utils/validators';
import classes from "@/styles/otp.module.scss"
// import HeadMeta from "@/components/Head";
import { GetServerSideProps } from "next";
import { baseUrl } from "@/contants/baseUrl";
import { XUPER_API_KEY } from "./_app";
import useNotification from "../hooks/useNotification";
import { useState } from "react";
import User from "@/store/user.store";


export default function OTP() {
    const router = useRouter();
    const { query } = router;

    const { handleSuccess, handleError } = useNotification();

    const [otp, setOtp] = useState('');
    const [visible, setVisible] = useState(false);
    const [error, setError] = useState('');
    const { setUser } = User()

    const handleOTPVerification = async () => {
        setVisible(true);
        setError("")
        console.log("clicked")
        try {
            const { data: res } = await axios.post(`${baseUrl}/customer/verify-code`, {
                email: query.email,
                code: otp,
            }, {
                headers: {
                    "x-superauth-key": `${XUPER_API_KEY}`,
                },
            });

            setUser({ ...res.data })

            Cookies.set("auth", res.data.accessToken);

            router.push("/");

        } catch (error) {
            console.log(error)
            if (isAxiosError(error)) {
                return setError(error?.response?.data.message);
            }
            setError('Something went wrong while processing your request');
        } finally {
            setVisible(false);
        }
    }

    const handleResendToken = async () => {
        try {
            setError("")
            setOtp("")
            setVisible(true);
            const { data: res } = await axios.post(`${baseUrl}/customer/send-code`, { email: query.email, }, {
                headers: {
                    "x-superauth-key": `${XUPER_API_KEY}`,
                },
            });
            console.log({ res })
            handleSuccess("OTP", "OTP Successfully Sent")
        } catch (error) {
            setVisible(false);
            if (isAxiosError(error)) {
                const data = error.response?.data;
                return setError(error?.response?.data.message);
            }
            setVisible(false);
            setError("Something went wrong while processing your request");
            handleError("OTP", "Something went wrong while processing your request")
            setVisible(false);
        } finally {
            setVisible(false)
        }
    };

    return (
        <div className={classes.wrapper}>
            {/* <HeadMeta pageName="Login" /> */}
            <div >
                <div className={classes.form}>
                    <div className={classes.card}>

                        <p className={classes.start}>Enter OTP Code</p>
                        <p className={classes.sec}>Enter 6 digits code sent to your email {query.email} </p>
                        {error && (
                            <Alert
                                // icon={<IconAlertCircle size='1rem' />}
                                title='An error occurred!'
                                color='red'
                                mb={30}
                                withCloseButton
                                closeButtonLabel='Close alert'
                                onClose={() => setError('')}
                            >
                                {error}
                            </Alert>
                        )}
                        <Group justify='center' className={classes.center} >
                            <PinInput
                                oneTimeCode
                                aria-label='One time code'
                                gap='lg'
                                // size='lg'
                                placeholder=''
                                // mask
                                variant='unstyled'
                                value={otp}
                                length={6}
                                onChange={(val) => setOtp(val)}
                            />
                        </Group>

                        <div className={classes.control}>
                            <Text c={"#666464"} fz={13} onClick={handleResendToken} style={{ cursor: "pointer" }}>Didn&apos;t get code? <Text c={"#fff"} component='span'> {"  "}Resend</Text> </Text>
                            <Button loading={visible} loaderProps={{ type: "dots" }} onClick={handleOTPVerification} variant="unstyled"><Text fz={14}>Verify Email</Text></Button>
                        </div>
                    </div>
                </div>
            </div >
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { req } = ctx;
    const authToken = req.cookies.auth;

    try {
        const { data: res } = await axios.get(`${baseUrl}/user/get`, {
            headers: { Authorization: `Bearer ${authToken}` },
        });

        return {
            redirect: {
                destination: `${res.data.role == "superadmin" ? "/admin/dashboard" : "/dashboard"}`,
                permanent: false,
            },
        };
    } catch (error) {
        return { props: {} };
    }
};
