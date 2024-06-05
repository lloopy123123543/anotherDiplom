import {useGigaChat} from "@/app/components/GigaChat/useGigaChat";
import {ViewGigaChat} from "@/app/components/GigaChat/ViewGigaChat";


export const GigaChat = () => {
  return(
    <ViewGigaChat {...useGigaChat()}/>
  )
}