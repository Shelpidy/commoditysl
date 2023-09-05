import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, ProgressBar, useTheme } from "react-native-paper";
import { Feather } from "@expo/vector-icons";

type ChatDownloadProgressProps = {
   progress: number | null;
};

const ChatDownloadProgress = ({ progress }: ChatDownloadProgressProps) => {
   const [downloadProgress, setDownloadProgress] = useState<number | null>(
      null
   );
   useEffect(() => {
      setDownloadProgress(progress);
   }, [progress]);

   const theme = useTheme();
   return (
      <View>
         <Text>ChatDownloadProgress</Text>
      </View>
   );
};

export default ChatDownloadProgress;

const styles = StyleSheet.create({});
