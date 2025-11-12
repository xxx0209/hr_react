import {
    Forum as ForumIcon,
    Diversity3 as Diversity3Icon,
    EditDocument as EditDocumentIcon,
    ManageAccounts as ManageAccountsIcon
} from "@mui/icons-material";

const board =
    [
        {
            id: 'board',
            icon: <ForumIcon sx={{ color: '#8b8c8dff' }} />,
            label: "게시판",
            baseToNo: 1,
            useSubs: true,
            subs: [
                {
                    no: 1,
                    label: "글쓰기",
                    to: "/board/write",
                    icon: ManageAccountsIcon,
                    isAdminMenu: false,
                    content: "글을 작성할 수 있는 메뉴입니다.\r\n"
                },
                {
                    no: 2,
                    label: "공지사항",
                    to: "/board/notice",
                    icon: Diversity3Icon,
                    isAdminMenu: false,
                    content: "회사의 공지사항을 관리합니다.\r\n관리자는 공지사항을 추가, 수정, 삭제할 수 있습니다."
                },
                {
                    no: 3,
                    label: "자유게시판",
                    to: "/board/free",
                    icon: EditDocumentIcon,
                    isAdminMenu: false,
                    content: "자유게시판에 글을 작성할 수 있는 메뉴입니다.\r\n"
                },
            ]
        }
    ];

export const BoardMenu = board;