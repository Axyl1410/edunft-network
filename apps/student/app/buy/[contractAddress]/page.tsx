import { GetItem } from "./get-item";

export default async function Page({
  params,
}: {
  params: Promise<{ contractAddress: string }>;
}) {
  const { contractAddress } = await params;

  return (
    <>
      <div className="my-2">
        <GetItem address={contractAddress} />
      </div>
      <div className="mt-8 grid w-full place-content-center">
        <p className="text-sm font-bold">End of listed for sale </p>
      </div>
    </>
  );
}
