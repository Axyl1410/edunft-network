"use client";

import CKEditorComponent from "@/components/markdown-editor";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActiveAccount } from "thirdweb/react";

export default function Page() {
  const [data, setData] = useState(null);
  const account = useActiveAccount();

  useEffect(() => {
    if (account?.address) {
      axios
        .get("http://localhost:8080/user/" + account?.address)
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          toast.error("Failed to fetch profile data", {
            description: error.message,
          });
        });
    }
  }, [account?.address]);

  console.log("Profile data:", data);

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex items-center justify-center gap-4">
        {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </div>
      <CKEditorComponent />
    </div>
  );
}
