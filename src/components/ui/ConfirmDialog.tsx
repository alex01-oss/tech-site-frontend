import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    CircularProgress,
    useTheme,
} from '@mui/material';
import {useDictionary} from "@/providers/DictionaryProvider";

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    content: string;
    isDeleting: boolean;
}

const ConfirmDeleteDialog: React.FC<Props> = ({
    open,
    onClose,
    onConfirm,
    title,
    content,
    isDeleting,
}) => {
    const theme = useTheme();
    const dict = useDictionary();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{ '& .MuiDialog-paper': { borderRadius: theme.shape.borderRadius } }}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
        >
            <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="confirm-dialog-description">
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    color="primary"
                    disabled={isDeleting}
                >
                    {dict.common.cancel}
                </Button>
                <Button
                    onClick={onConfirm}
                    color="error"
                    variant="contained"
                    disabled={isDeleting}
                    autoFocus
                >
                    {isDeleting
                        ? <CircularProgress size={theme.spacing(3)} aria-label={dict.common.deleting} />
                        : dict.common.delete}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDeleteDialog;