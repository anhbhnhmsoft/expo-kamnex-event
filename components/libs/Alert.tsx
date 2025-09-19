import {AlertDialog, Button, Card, XStack, YStack} from 'tamagui'
import {FC, ReactNode} from "react";
import DefaultColor from "@/components/ui/defaultColor";
import Typo from "@/components/libs/Typo";
import {useTranslation} from "react-i18next";
import {DefaultSize} from "@/components/ui/defaultStyle";

type Props = {
    trigger: () => ReactNode,
    title: string,
    description: string,
    onClose?: () => void,
    onAccept?: () => void,
}

const Alert:FC<Props> = (props) => {
    const {t} = useTranslation();

    return (
        <AlertDialog>
            <AlertDialog.Trigger asChild>
                {props.trigger()}
            </AlertDialog.Trigger>

            <AlertDialog.Portal>
                <AlertDialog.Overlay
                    key="overlay"
                    animation="quick"
                    backgroundColor="$shadow6"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />
                <AlertDialog.Content
                    key="content"
                    animation={[
                        'quick',
                        {
                            opacity: {
                                overshootClamping: true,
                            },
                        },
                    ]}
                    enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                    exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                    x={0}
                    backgroundColor={"transparent"}
                    scale={1}
                    opacity={1}
                    y={0}
                >
                    <Card gap="$4" backgroundColor={DefaultColor.white} padded>
                        <YStack gap={"$4"}>
                            <Typo weight={"700"} fontSize={DefaultSize["2xl"]} color={DefaultColor.primary_color}>{props.title}</Typo>
                            <Typo weight={"500"} fontSize={DefaultSize["base"]} lineHeight={DefaultSize["xl"]}>{props.description}</Typo>
                        </YStack>

                        <XStack gap="$3" justifyContent="flex-end">
                            <AlertDialog.Cancel asChild onPress={() => {
                                if (props.onClose) props.onClose();
                            }}>
                                <Button>{t('common.cancel')}</Button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action asChild onPress={() => {
                                if (props.onAccept) props.onAccept();
                            }}>
                                <Button theme="blue" color={DefaultColor.white} backgroundColor={DefaultColor.primary_color}>{t('common.accept')}</Button>
                            </AlertDialog.Action>
                        </XStack>
                    </Card>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog>
    )
}

export default Alert;