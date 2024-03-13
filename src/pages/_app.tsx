import "@/styles/globals.css";
import type { AppProps } from "next/app";

import '@mantine/core/styles.css';
import "@mantine/notifications/styles.css"

import { MantineProvider, createTheme } from "@mantine/core";
import { colors } from "@/theme/colors";


export const XUPER_API_KEY = "test_2a709364a2b197e2d2e74dfbeb5a98aeef6751248bde103d443e16ded48591ce"

export default function App({ Component, pageProps }: AppProps) {
  const theme = createTheme({
    /** Put your mantine theme override here */
    fontFamily: "DM Sans",
    colors: {
      // @ts-ignore
      template: [...colors.primary],
      // @ts-ignore
      "template-secondary": [...colors.primary],
    },
    primaryColor: "template",
    primaryShade: 5,
  });

  return (
    <MantineProvider theme={theme}>
      <Component {...pageProps} />
    </MantineProvider>
  );
}
