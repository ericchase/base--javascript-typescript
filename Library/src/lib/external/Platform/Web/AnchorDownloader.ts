export class AnchorDownloader {
  static download(data: string, filename: string) {
    const a = document.createElement('a');
    a.setAttribute('href', data);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  static Blob(blob: Blob, filename: string) {
    AnchorDownloader.download(URL.createObjectURL(blob), filename);
  }
  static Url(url: string, filename: string) {
    AnchorDownloader.download(url, filename);
  }

  static Buffer(buffer: ArrayBuffer, filename: string) {
    AnchorDownloader.Blob(new Blob([buffer], { type: 'application/octet-stream;charset=utf-8' }), filename);
  }
  static JSON(json: string, filename: string) {
    AnchorDownloader.Blob(new Blob([json], { type: 'application/json;charset=utf-8' }), filename);
  }
  static Text(text: string, filename: string) {
    AnchorDownloader.Blob(new Blob([text], { type: 'text/plain;charset=utf-8' }), filename);
  }
}
