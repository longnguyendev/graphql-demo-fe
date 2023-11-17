import { capitalize } from "@mui/material";
import { formatRelative } from "date-fns";

export const formatDate = (createdAt: number) =>
  capitalize(formatRelative(new Date(createdAt), new Date()));
