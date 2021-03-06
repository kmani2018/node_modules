"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// import { relative, Path } from "../../../angular_devkit/core/src/virtual-fs";
const core_1 = require("@angular-devkit/core");
function parseName(path, name) {
    const nameWithoutPath = core_1.basename(core_1.normalize(name));
    const namePath = core_1.dirname(core_1.join(core_1.normalize(path), name));
    return {
        name: nameWithoutPath,
        path: core_1.normalize('/' + namePath),
    };
}
exports.parseName = parseName;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UtbmFtZS5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvcGFyc2UtbmFtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBOzs7Ozs7R0FNRztBQUNILGdGQUFnRjtBQUNoRiwrQ0FBZ0Y7QUFPaEYsU0FBZ0IsU0FBUyxDQUFDLElBQVksRUFBRSxJQUFZO0lBQ2xELE1BQU0sZUFBZSxHQUFHLGVBQVEsQ0FBQyxnQkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDbEQsTUFBTSxRQUFRLEdBQUcsY0FBTyxDQUFDLFdBQUksQ0FBQyxnQkFBUyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBUyxDQUFDLENBQUM7SUFFOUQsT0FBTztRQUNMLElBQUksRUFBRSxlQUFlO1FBQ3JCLElBQUksRUFBRSxnQkFBUyxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUM7S0FDaEMsQ0FBQztBQUNKLENBQUM7QUFSRCw4QkFRQyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuLy8gaW1wb3J0IHsgcmVsYXRpdmUsIFBhdGggfSBmcm9tIFwiLi4vLi4vLi4vYW5ndWxhcl9kZXZraXQvY29yZS9zcmMvdmlydHVhbC1mc1wiO1xuaW1wb3J0IHsgUGF0aCwgYmFzZW5hbWUsIGRpcm5hbWUsIGpvaW4sIG5vcm1hbGl6ZSB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcblxuZXhwb3J0IGludGVyZmFjZSBMb2NhdGlvbiB7XG4gIG5hbWU6IHN0cmluZztcbiAgcGF0aDogUGF0aDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlTmFtZShwYXRoOiBzdHJpbmcsIG5hbWU6IHN0cmluZyk6IExvY2F0aW9uIHtcbiAgY29uc3QgbmFtZVdpdGhvdXRQYXRoID0gYmFzZW5hbWUobm9ybWFsaXplKG5hbWUpKTtcbiAgY29uc3QgbmFtZVBhdGggPSBkaXJuYW1lKGpvaW4obm9ybWFsaXplKHBhdGgpLCBuYW1lKSBhcyBQYXRoKTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6IG5hbWVXaXRob3V0UGF0aCxcbiAgICBwYXRoOiBub3JtYWxpemUoJy8nICsgbmFtZVBhdGgpLFxuICB9O1xufVxuIl19