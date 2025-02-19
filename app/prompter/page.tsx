import Image from "next/image";
import SearchBar from '@/components/SearchBar'
import DynamicCardCode from '@/components/DynamicCardCode'
import GlobalDataPromptCardMaker from '@/components/promtp_card_maker'

export default function Home() {
  return (
    <main className="flex max-h-screen flex-col items-center justify-between">
        <GlobalDataPromptCardMaker />
    </main>
  );
}