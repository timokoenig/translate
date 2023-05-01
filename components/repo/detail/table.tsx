import {
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  Box,
} from "@chakra-ui/react";
import { useRepoStore } from "@/utils/store/repo/repo-context";
import RepositoryDetailListRow from "./table-row";
import Actions from "./actions";

type Props = {
  search: string;
};

const RepositoryDetailList = (props: Props) => {
  const { translationFile } = useRepoStore();
  const filteredTranslations = Object.keys(translationFile?.data ?? {})
    .map((key) => {
      const data = translationFile?.data as { [key: string]: string };
      return { key, value: data[key] };
    })
    // sort by key name
    .sort((a, b) => (a.key > b.key ? 1 : a.key < b.key ? -1 : 0))
    // filter based on users search query
    .filter((obj) => {
      if (props.search == "") return true;
      return obj.key.includes(props.search) || obj.value.includes(props.search);
    });

  return (
    <>
      <Actions />
      <TableContainer margin={0} padding={2}>
        <Table variant="simple" margin={0}>
          <Thead>
            <Tr>
              <Th>Key</Th>
              <Th>Value</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredTranslations.map((translation, index) => (
              <RepositoryDetailListRow key={index} translation={translation} />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default RepositoryDetailList;
