export default function MyLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex h-full w-full flex-1 justify-center bg-black">
      <div className="flex max-w-[600px] flex-1 flex-col">{children}</div>
    </div>
  );
}
