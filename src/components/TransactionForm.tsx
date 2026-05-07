"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AccountOption = {
    id: string;
    name: string;
}