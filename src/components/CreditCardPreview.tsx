import React from "react";

type CreditCardPreviewProps = {
  cardNumber: string;
  cardHolder?: string;
  expiration: string;
  cvv: string;
};

const sanitizeCardNumber = (cardNumber: string) => {
  const digits = cardNumber.replace(/\D/g, "").slice(0, 16);

  if (!digits) {
    return "0000 0000 0000 0000";
  }

  const chunks: string[] = [];
  for (let i = 0; i < digits.length; i += 4) {
    chunks.push(digits.slice(i, i + 4));
  }

  const formatted = chunks.join(" ");
  const mask = "0000 0000 0000 0000";

  return (formatted + mask.slice(formatted.length)).trimEnd();
};

const sanitizeCardHolder = (cardHolder?: string) => {
  if (!cardHolder) {
    return "NOM DU TITULAIRE";
  }

  return cardHolder
    .toUpperCase()
    .replace(/[^A-ZÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸ -]/g, "")
    .slice(0, 26) || "NOM DU TITULAIRE";
};

const sanitizeExpiration = (expiration: string) => {
  if (!expiration) {
    return "MM/AA";
  }

  return expiration;
};

const CreditCardPreview: React.FC<CreditCardPreviewProps> = ({
  cardNumber,
  cardHolder,
  expiration,
  cvv,
}) => {
  const formattedNumber = sanitizeCardNumber(cardNumber);
  const formattedHolder = sanitizeCardHolder(cardHolder);
  const formattedExpiration = sanitizeExpiration(expiration);
  const formattedCvv = cvv ? cvv.padEnd(3, "•").slice(0, 4) : "•••";

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="relative z-10 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl p-6 sm:p-8 min-h-[210px] flex flex-col justify-between transform transition-transform duration-500 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <span className="text-sm uppercase tracking-widest text-white/80">
            Carte Bancaire
          </span>
          <span className="text-lg font-semibold">
            {formattedNumber.startsWith("4")
              ? "VISA"
              : formattedNumber.startsWith("5")
              ? "Mastercard"
              : formattedNumber.startsWith("3")
              ? "Amex"
              : "SecurePay"}
          </span>
        </div>

        <div className="flex items-center gap-4 mt-6 sm:mt-8">
          <div className="w-10 h-8 sm:w-12 sm:h-10 bg-white/80 rounded-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-white/40" />
            <div className="absolute inset-1 border border-white/70 rounded-md" />
          </div>
          <div className="flex-1">
            <p className="text-lg sm:text-2xl tracking-[0.2em] font-mono font-semibold">
              {formattedNumber}
            </p>
            <p className="text-xs text-white/70 mt-2">Numéro de carte</p>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-6 mt-6 sm:mt-8 text-sm sm:text-base">
          <div>
            <p className="text-xs uppercase text-white/70 tracking-widest">
              Titulaire
            </p>
            <p className="font-semibold tracking-wide mt-1">
              {formattedHolder}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-white/70 tracking-widest">
              Expire
            </p>
            <p className="font-semibold tracking-wide mt-1">
              {formattedExpiration}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-white/70 tracking-widest">
              CVV
            </p>
            <p className="font-semibold tracking-wide mt-1">
              {formattedCvv}
            </p>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-3 -bottom-6 sm:-bottom-8 rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-60 blur-xl h-24" />
    </div>
  );
};

export default CreditCardPreview;

