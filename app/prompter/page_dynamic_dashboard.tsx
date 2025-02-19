import Image from "next/image";
import SearchBar from '@/components/SearchBar'
import DynamicCardCode from '@/components/DynamicCardCode'
import GlobalDataPromptCardMaker from '@/components/promtp_card_maker'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-start min-h-screen ">
      <SearchBar />
      <div className="w-full max-w-9xl mt-8">
        <DynamicCardCode />
        {/* <GlobalDataPromptCardMaker /> */}
      </div>
      </div>
    </main>
  );
}