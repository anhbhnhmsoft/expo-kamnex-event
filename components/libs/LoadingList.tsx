import {YStack} from "tamagui";
import React from "react";
import SkeletonFade from "@/components/libs/SkeletonFade";

const LoadingList = () => {
    return (
        <YStack gap={"$2"}>
            <SkeletonFade width={"100%"} height={10}/>
            <SkeletonFade width={"90%"} height={10}/>
            <SkeletonFade width={"80%"} height={10}/>
            <SkeletonFade width={"70%"} height={10}/>
            <SkeletonFade width={"80%"} height={10}/>
            <SkeletonFade width={"80%"} height={10}/>
            <SkeletonFade width={"90%"} height={10}/>
            <SkeletonFade width={"70%"} height={10}/>
            <SkeletonFade width={"50%"} height={10}/>
        </YStack>
    )
}

export default LoadingList;