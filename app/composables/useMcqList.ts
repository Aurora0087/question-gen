

export function useMcqList() {
    const listOfMcqPaper = useState<any[]>('listOfMcqPaper',()=>[]);
    const isLoading = useState('isLoading',()=>false);
    const hasMoreMcqs = useState('hasMoreMcqs',()=>true);
    const pageNumber = useState('pageNumber',()=>1);

    async function getMcqs() {
        if (isLoading.value || !hasMoreMcqs.value) return;

        isLoading.value = true;

        try {

            const response: any = await $fetch("/backendApi/api/v1/chats/mcq/current", {
                method: "POST",
                body: { page: pageNumber.value },
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            
            

            if (response.data.docs) {
                listOfMcqPaper.value.push(
                    ...response.data.docs.map((doc:any) => ({
                        label: String(doc.topic),
                        to: `/dashbord/mcq/${doc._id}`,
                    }))
                );
            }

            hasMoreMcqs.value = response.data.hasNextPage;
            pageNumber.value += 1;

        } catch (err:any) {
            hasMoreMcqs.value = false;
            throw err;
            
        } finally {
            isLoading.value = false;
        }
    }


    return {
        listOfMcqPaper,
        isLoading,
        hasMoreMcqs,
        pageNumber,
        getMcqs,
      };
}