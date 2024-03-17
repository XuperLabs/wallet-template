
import { useState } from "react";
import { useRouter } from "next/navigation";
import Router from "next/router";

import axios, { isAxiosError } from "axios";

import { useForm } from "@mantine/form";
import {
    Paper,
    TextInput,
    PasswordInput,
    Checkbox,
    Button,
    Title,
    Text,
    rem,
    Grid,
    Center,
    Group,
    Divider,
    ButtonProps,
    LoadingOverlay,
    Box,
    Image,
    Alert,
    Container,
    Avatar
} from "@mantine/core";

// import { loginValidator } from '@/utils/validators';
import classes from "@/styles/get-started.module.scss"

// import HeadMeta from "@/components/Head";

import { GetServerSideProps } from "next";
import { baseUrl } from "@/contants/baseUrl";
import { XUPER_API_KEY } from "./_app";
import User from "@/store/user.store";


export default function Login() {
    const router = useRouter();
    const { user } = User()

    const [visible, setVisible] = useState(false);
    const [error, setError] = useState("");

    const form = useForm({
        initialValues: {
            email: ""
        },
        // validate: loginValidator,
    });

    const handleSubmit = async () => {


        try {
            form.validate();
            const { errors, values } = form;
            console.log(errors)
            if (Object.keys(errors).length) return;

            setVisible(true);
            const { data: res } = await axios.post(`${baseUrl}/customer/send-code`, values, {
                headers: {
                    "x-superauth-key": `${XUPER_API_KEY}`,
                },
            },);
            console.log({ res })
            Router.push({
                pathname: "/otp",
                query: { email: values.email },
            });

        } catch (error) {
            setVisible(false);
            if (isAxiosError(error)) {
                const data = error.response?.data;
                return setError(error?.response?.data.message);
            }
            setVisible(false);
            setError("Something went wrong while processing your request");
            setVisible(false);
        }
    };

    if (user?.wallet_address) {
        router.push("/")
    }
    return (
        <div className={classes.wrapper}>
            <div >
                <div className={classes.form}>
                    <div style={{ width: "100%" }}>

                        <p className={classes.start}>welcome</p>
                        <p className={classes.sec}>Login to your Xuperwallet</p>
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

                        <label htmlFor="email">Email address</label>
                        <input type="email" placeholder="text@mail.com" onChange={(event) =>
                            form.setFieldValue("email", event.currentTarget.value)
                        } />
                        <p style={{ color: "red", margin: "0px" }}>{form.errors.email && form.errors.email}</p>

                        <div className={classes.control}>
                            <p className={classes.help}>Need help?</p>
                            <Button loading={visible} loaderProps={{ type: "dots" }} onClick={handleSubmit} variant="unstyled"><Text fz={14}>Continue</Text></Button>
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
