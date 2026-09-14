export class ErrorUtils {
    static getMessage(result) {
        return result?.message || '';
    }

    static show(result, element) {
        if (!element) return;

        element.textContent = ErrorUtils.getMessage(result);
    }
}
