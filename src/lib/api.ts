import { ENV } from "@/utils/env"
import axios from "axios"
export const Api = axios.create({
    baseURL: ENV.apiUrl
})