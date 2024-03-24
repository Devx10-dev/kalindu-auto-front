import React, { useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import { Input} from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BoxSelect, Search, SquareMousePointer } from 'lucide-react';
import TablePagination from './TablePagination';

const CreditorsTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [creditors, setCreditors] = useState([
    'Creditor 1',
    'Creditor 2',
    'Creditor 3',
    'Creditor 4',
    'Creditor 5',
  ]);

  const handleSearch = (e:any) => {
    setSearchQuery(e.target.value);
  };

  const filteredCreditors = creditors.filter((creditor) =>
    creditor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="">
      <div className="mb-4 flex gap-10">
        <Input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search creditors..."
          className="w-1/4"
        />
        <Button variant={'secondary'}><Search className="mr-2 h-4 w-4" />Search</Button>
      </div>
      <Table className='w-3/4'>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Creditor</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Balance</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {creditors.map((creditor) => (
          <TableRow key={creditor}>
            <TableCell className="font-medium">{creditor}</TableCell>
            <TableCell>{creditor}</TableCell>
            <TableCell>{creditor}</TableCell>
            <TableCell className="text-right"><Button><SquareMousePointer  className="mr-2 h-4 w-4" />Select</Button></TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TablePagination />
      </TableFooter>
    </Table>
    </div>
  );
};

export default CreditorsTable;