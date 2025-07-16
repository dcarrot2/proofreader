import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TextArea from "./client/TextArea";


export default async function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px]  justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center w-full">
        <Tabs
          defaultValue="form"
          className="w-full flex flex-col items-center gap-4"
        >
          <TabsList className="">
            <TabsTrigger value="form">Form</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
          </TabsList>
          <TabsContent
            value="form"
            className="w-full flex flex-col items-center gap-4"
          >
            <div className="w-full">
              <TextArea />
            </div>
          </TabsContent>
          <TabsContent value="submissions">
            <Submissions />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}


function Submissions() {
  return null;
}
