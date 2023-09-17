import { getBranches, mergeBranch, tag, mergeRequest } from './api'
import { curBranches, mergeSourseBranch } from "./branches";
import fs from 'fs'


let branches = [];
const auto = async () => {
   const mm = await getBranches();
   const mainBranch = mm.filter(branchItem => branchItem.default)[0].name;
   branches = mm.map(branchItem => branchItem.name)
   console.log('branches', branches, 'mainBranch', mainBranch);


   // merge into main
   mergeBranch(mergeSourseBranch, mainBranch).then(res => {
      // console.log('mergeBranch-res', res);
      const { user, iid } = res;
      console.log('merge-id', iid);
      if (user && user.can_merge) {
         // merge immediately will return 'Branch cannot be merged'
         setTimeout(
            () => {
               mergeRequest(iid).then(res => {
                  // console.log('mergeRequest-res', res);
                  // tag main
                  tag(mainBranch, mainBranch.split('_').slice(-1)[0]).then(res => {

                     console.log('tagMain-res', res);
                     branches.map(async branch => {
                        const lastVBranches = curBranches.split('\r\n')
                        console.log('lastVBranches', lastVBranches);
                        console.log(branch, lastVBranches.includes(branch), branch != mainBranch);
                        if (!lastVBranches.find(el => el == branch) && branch != mainBranch && branch != mergeSourseBranch) {
                           const mergeData = await mergeBranch(mainBranch, branch)
                           console.log('mergeData', mergeData);
                        }
                     })
                  });
               }).catch(err => { console.log('mergeRequest-err', err); console.log('mergeRequest-err'); })
            }
            , 10000)
      }
   }).catch(err => { console.log('mergeBranch-err', err.response?.data); });



}
auto();