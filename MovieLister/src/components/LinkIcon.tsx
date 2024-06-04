import { useEffect } from "react";
import { Dimensions, Image, Linking, Text, TouchableOpacity } from "react-native"
import Animated from "react-native-reanimated";

type LinkIconProps = {
  href: string;
  service: StreamingServices;
};

export enum StreamingServices {
  prime = "prime",
  netflix = "netflix",
  disney = "disney",
  hulu = "hulu",
  now = "now",
  apple = "apple"
}

const streamingServices = {
    "prime": "primevideo://open?url=",
    "netflix": "nflx://",
    "disney": "disneyplus://",
    "hulu": "hulu:/",
    "now": "now://",
    "apple": "apple:/"
}

const {width, height} = Dimensions.get('window')

export default function LinkIcon({ href, service } : LinkIconProps) {
    const handleClick = () => {
        const streamingPrefix : string = streamingServices[service];4
        if(service === StreamingServices.prime){
          Linking.canOpenURL(streamingPrefix + href).then(supported => {
            if (supported) {
              Linking.openURL(streamingPrefix + href);
            } else {
              Linking.openURL(href);
            }
          });
        }
        else{
          Linking.canOpenURL(href.replace("https://", streamingPrefix)).then(supported => {
            if (supported) {
              Linking.openURL(href.replace("https://", streamingPrefix));
            } else {
              Linking.openURL(href);
            }
          });          
        }
    }

    const renderStreamingIcon = () => {
      switch(service){
        case StreamingServices.netflix:
          return <Image style={{aspectRatio:1, height:height/22}} className = "rounded-xl mr-2" source={require("../../assets/netflix.png")}  />
        case StreamingServices.prime:
          return <Image style={{aspectRatio:1, height:height/22}} className = "rounded-xl mr-2" source={require("../../assets/prime.png")}  />
        case StreamingServices.disney:
          return <Image style={{aspectRatio:1, height:height/22}} className = "rounded-xl mr-2" source={require("../../assets/disney.png")}  />
        case StreamingServices.hulu:
          return <Image style={{aspectRatio:1, height:height/22}} className = "rounded-xl mr-2" source={require("../../assets/hulu.jpg")}  />
        case StreamingServices.now:
          return <Image style={{aspectRatio:1, height:height/22}} className = "rounded-xl mr-2" source={require("../../assets/now.jpg")}  />
        case StreamingServices.apple:
          return <Image style={{aspectRatio:1, height:height/22}} className = "rounded-xl mr-2" source={require("../../assets/apple.png")}  />
      }
    }
    
    return (
        <TouchableOpacity onPress={() => handleClick()} className="mt-1" style={{aspectRatio: 1}}>
            {
              renderStreamingIcon()
            }

        </TouchableOpacity>
    )
}