import { notifications } from "@mantine/notifications";
import { IconCheck, IconInfoCircle, IconX } from "@tabler/icons-react";

const useNotification = () => {
    const handleError = (title: string, msg: string) => {
        notifications.show({
            title: title,
            message: msg, 
            icon: <IconX size="0.8rem" />,
            color: "red",
            styles: (theme) => ({
                root: {
                    backgroundColor: "#FEEDE6",
                    border: "1px solid #F44708",
                    width: "500px",
                    borderRadius: "5px",
                    zIndex: 1000000000000000
                },

                title: { fontSize: "13px", fontWeight: 700, color: "#F44708" },
                description: { color: "#F44708", fontSize: "11px" },
                closeButton: {
                    color: "#F44708",
                    "&:hover": { backgroundColor: "none" },
                },
            }),
        });
    };

    const handleSuccess = (title: string, msg: string) => {
        notifications.show({
            title: title,
            message: msg,
            icon: <IconCheck size="0.8rem" />,
            color: "#76AD87",
            styles: (theme) => ({
                root: {
                    backgroundColor: "#fff",
                    border: "1px solid #76AD87",
                    width: "500px",
                    borderRadius: "5px",

                    //   "&::before": { backgroundColor: theme.white },
                },

                title: { fontSize: "13px", fontWeight: 700, color: "#375F43" },
                description: { color: "#375F43", fontSize: "11px" },
                closeButton: {
                    color: "teal",
                    "&:hover": { backgroundColor: "none" },
                },
            }),
        });
    };

    const handleInfo = (title: string, msg: string) => {
        notifications.show({
            title: title,
            message: msg,
            icon: <IconInfoCircle size="0.8rem" />,
            color: "blue",
            autoClose: false,
            styles: (theme) => ({
                root: {
                    backgroundColor: "#E7F5FF",
                    border: "1px solid #228BE6",
                    width: "500px",
                    borderRadius: "5px",

                    //   "&::before": { backgroundColor: theme.white },
                },

                title: { fontSize: "13px", fontWeight: 700, color: "#228BE6" },
                description: { color: "#228BE6", fontSize: "11px" },
                closeButton: {
                    color: "#228BE6",
                    // "&:hover": { backgroundColor: theme.colors.blue[7] },
                },
            }),
        });
    };

    return {
        handleError,
        handleInfo,
        handleSuccess,
    };
};

export default useNotification;
