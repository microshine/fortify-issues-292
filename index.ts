import * as graphene from "graphene-pk11";

const lib = "/usr/local/lib/softhsm/libsofthsm2.so";
const slotId = 0;

async function main() {
  const token = graphene.Module.load(lib);
  token.initialize();
  try {
    const slot = token.getSlots(slotId);
    const pkcs11 = slot.lib;
    const mechanisms = pkcs11.C_GetMechanismList(slot.handle);
    mechanisms.forEach((mechanism, index) => {
      const name = graphene.MechanismEnum[mechanism];
      console.log(`Mechanism #${index}`);
      console.log("  Name:", name ?? `Unknown mechanism(0x${mechanism.toString(16)})`);
      try {
        const mechanismInfo = pkcs11.C_GetMechanismInfo(slot.handle, mechanism);
        console.log("  Flags:", mechanismInfo.flags);
        console.log("  Max key size:", mechanismInfo.maxKeySize);
        console.log("  Min key size:", mechanismInfo.minKeySize);
      } catch (e) {
        console.log("  Error:", e.message);
      }
    });
  }
  finally {
    token.finalize();
  }
}

main()
  .catch(e => console.error(e));