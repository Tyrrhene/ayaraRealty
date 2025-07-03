import Image from 'next/image'
import ayara_logo_sideways from '../../../assets/ayara_logo_sideways.svg' // likely a URL
//test deployment
export const Logo = () => {
  return (
    <Image
      src={ayara_logo_sideways}
      alt="Ayara Realty Logo"
      width={180} // or your actual width
      height={180} // or your actual height
      priority
    />
  )
}
