import { useQuery } from "@tanstack/react-query";
import * as adminReportApi from "../api/adminReportApi";

export const useSalesReportQuery = (params) =>
  useQuery({ queryKey: ["salesReport", params], queryFn: () => adminReportApi.getSalesReport(params) });