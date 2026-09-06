export class GetDataUtils {
    static getData(data) {
        this.data = data ? data : new Date();
        const year = this.data.getFullYear();
        const month = addZeroData(this.data.getMonth() + 1);
        const day = addZeroData(this.data.getDate());
        return (`${year}-${month}-${day}`);

        function addZeroData(data) {
            if(data < 10) {
                return '0' + data;
            }
            return data;
        }
    }


}