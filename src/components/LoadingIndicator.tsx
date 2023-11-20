import { View } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";

type loadingProps = {
    text?:string
}

const LoadingIndicator  = ({text}:loadingProps)=>{

    const theme = useTheme()
    return(
        <View
        style={{
           flexDirection: "row",
           justifyContent: "center",
           alignItems: "center",
           backgroundColor:theme.colors.background,
           flex:1
        }}>
        <ActivityIndicator color="#cecece" size="small" />
        {
            text && <Text style={{ color: "#cecece", marginLeft: 5 }}>
            {text}
         </Text>
        }
        
     </View>
    )
}

export default  LoadingIndicator;