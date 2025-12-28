interface FileItem {
    oid: string;
    name: string;
    uploadedBy: string;
    fileLocation: { folder: string };
    size: string;
    uploadedAt: string;
}

interface FolderItem {
    id: string;
    type: 'folder';
    name: string;
}

interface FileItemWithType extends FileItem {
    type: 'file';
}

const getItemsInFolder = (files: FileItem[], currentFolder: string | null) => {
    const folders = new Set<string>();
    const visibleItems: FileItem[] = [];

    files.forEach((file: FileItem) => {
        const path = file.fileLocation.folder;
        const pathParts = path.split('/');

        if(!currentFolder) {
            if(pathParts.length === 1) {
                visibleItems.push(file);
            } else {
                folders.add(pathParts[0]);
            }
            return;
        }
        if(path.startsWith(currentFolder+'/')) {
            const rest = path.replace(currentFolder+'/', '');
            const restParts = rest.split('/');

            if(restParts.length === 1) {
                visibleItems.push(file);
            } else {
                folders.add(restParts[0]);
            }
        }
    });

    return {
        folders: Array.from(folders).map((name: string) => ({
        id: `folder-${name}`,
        type: 'folder' as const,
        name,
        })) as FolderItem[],
        files: visibleItems.map((file: FileItem) => ({
        ...file,
        type: 'file' as const,
        })) as FileItemWithType[],
    }
};

export default getItemsInFolder;
