import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

interface TokenBalance {
  name: string;
  symbol: string;
  balance: string;
  allowance: string;
}

interface TokenTableProps {
  balances: TokenBalance[];
}

export default function TokenTable({ balances }: TokenTableProps) {
  return (
    <Card className="mt-10 w-full max-w-4xl animate-fade-in border-[#6366F1]">
      <CardContent>
        <Table className="mt-4">
          <thead className="p-8">
            <tr>
              <TableHead className="text-left">Asset</TableHead>
              <TableHead className="text-left">Allowance (decimals)</TableHead>
              <TableHead className="text-left text-sm">Balance</TableHead>
            </tr>
          </thead>
          <TableBody>
            {balances.map((asset, index) => (
              <TableRow key={index}>
                <TableCell className="text-left text-large">
                  <div>{asset.name.trim()}</div>
                </TableCell>
                <TableCell className="text-left">{asset.allowance}</TableCell>
                <TableCell className="text-left">
                  {parseFloat(asset.balance).toFixed(6)} {asset.symbol}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
